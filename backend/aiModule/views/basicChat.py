from django.apps import apps

# from datetime import date, datetime, timedelta, timezone


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from utility.helpers.response import generate_response, error_list_object
from users.middleware.expiring_token_auth import ExpiringTokenAuthentication

from aiModule.scripts.openai_wrapper import OpenAIWrapper
from aiModule.scripts.claude_wrapper import ClaudeWrapper
from aiModule.scripts.mistral_wrapper import MistralWrapper
from aiModule.scripts.hugging_wrapper import HuggingWrapper

from aiModule.serializers.message_serializers import MessageSerializer
from aiModule.serializers.config_serializers import ConfigSerializer

from aiModule.models.llmConfig import LLM, MODELS

from django.contrib.auth.models import User

# import time

import json


class ChatComplete(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        returns chat message with convo

        takes in:
            prompt: the users prompt
            converstaion:the pk of the related conversation, do not include to start a new conversation
            config: includes the various elements required to send a chat
                api_key: the api key for the llm and model you are trying to use *required
                llm: openai, mistral, claude, llamma (coming soon) *required
                chat_model: the specific model to use t=with the llm ex. claude-3-opus-20240229, gpt-3.5-turbo....
                system_instructions: the system instructions for the llm only relevant if its a new conversation

            - a config object with at least and llm and api_key are required to create a conversation
            - if a conversation pk is not present the system will start a new conversation with a new config
            - if a config and a conversation are present the system wll attempt to change the config for that conversation

            models and llms
                "OPEN_AI": ["gpt-3.5-turbo","gpt-4-turbo"],
                "CLAUDE": ["claude-3-opus-20240229"],
                "MISTRAL": ["mistral-large-latest"]

        """
        try:

            try:
                user = request.user
                # user = User.objects.get(email="jordan.meyler+test@test.com")
                data = json.loads(request.body)
                # remove empty fields from configuration**

                try:
                    if "config" in data:
                        temp = {**data["config"]}
                        for ele in temp:
                            if not temp[ele] or str(temp[ele]) == "":
                                del data["config"][ele]

                except Exception as e:
                    return generate_response(
                        status=400,
                        data="Error parsing data please refer to custom message for details.",
                        custom_message=str(e),
                    )

            except Exception as e:
                print("could not parse data")

            try:
                prompt = data["prompt"]
            except Exception as e:
                return generate_response(
                    status=400,
                    data="Could not find prompt.",
                    custom_message="No Prompt",
                )

            # used to check if valid to delete if error
            config = None
            conversation = None
            try:
                # get or create conversation
                if "conversation" in data and int(data["conversation"]):
                    conversation = apps.get_model("aiModule.Conversation").objects.select_related("llm_config").get(
                        pk=int(data["conversation"])
                    )

                    # check for config update then update config or create config if there is none
                    if "config" in data:
                        try:
                            if conversation.llm_config:
                                config_serializer = ConfigSerializer(
                                    conversation.llm_config,
                                    data=data["config"],
                                    partial=True,
                                )
                            else:
                                config_serializer = ConfigSerializer(
                                    data=data["config"]
                                )

                            if config_serializer.is_valid():
                                config = config_serializer.save()
                                conversation.llm_config = config
                                conversation.save()
                            else:
                                # return errors
                                ret = []
                                for err in config_serializer.errors:
                                    try:
                                        ret.append(
                                            error_list_object(
                                                err,
                                                str(config_serializer.errors[err][0]),
                                            )
                                        )
                                    except Exception as e:
                                        print(
                                            f"error processing serializer errors: {e}"
                                        )

                                return generate_response(
                                    status=422,
                                    data=ret,
                                    custom_message="Invalid configuration, if you are trying to update the configuration please refer to docs; otherwise remove the config object to send messages using current llm_config",
                                )

                        except Exception as e:
                            print(
                                f"Error processing configuration in ChatComplete: {e}"
                            )
                            return generate_response(
                                status=400,
                                data="Error serializing update to configuration",
                                custom_message=f"Error: {e}",
                            )
                else:

                    if not "config" in data or "llm" not in data["config"]:
                        return generate_response(
                            status=400,
                            data="config required to start a conversation, must include at least: llm.",
                            custom_message=None,
                        )

                    # check config
                    # if not "config" in data or "api_key" not in data["config"] or "llm" not in data["config"]:
                    #     return generate_response(status=400, data="config required to start a conversation, must include at least: api_key & llm. \nsystemInstruction and chat_model can also be set using the config object", custom_message=None)

                    # create conversation
                    conversation = apps.get_model(
                        "aiModule.Conversation"
                    ).objects.create(
                        name=f"{prompt[:10]} .." if len(prompt) > 10 else prompt,
                        owner=user.profile,
                    )

                    # create config object and link to conversation
                    config_serializer = ConfigSerializer(data=data["config"])
                    if not config_serializer.is_valid():
                        # return errors
                        ret = []
                        for err in config_serializer.errors:
                            try:
                                ret.append(
                                    error_list_object(
                                        err, str(config_serializer.errors[err][0])
                                    )
                                )
                            except Exception as e:
                                print(f"error processing serializer errors: {e}")

                        # delete conversation to avoid unnecessary creation
                        conversation.delete()
                        return generate_response(
                            status=422, data=ret, custom_message=None
                        )

                    try:
                        config = config_serializer.save()
                    except Exception as e:
                        conversation.delete()
                        return generate_response(
                            status=400,
                            data="Error creating config.",
                            custom_message=f"Error: {e}",
                        )

                    try:
                        conversation.llm_config = config
                        conversation.save()
                    except Exception as e:
                        conversation.delete()
                        config.delete()
                        return generate_response(
                            status=400,
                            data="Error updating conversation.",
                            custom_message=f"Error: {e}",
                        )

            except Exception as e:
                # delete from here
                if conversation:
                    conversation.delete()
                if config:
                    config.delete()

                print(f"Error retrieving conversation:{e}")
                return generate_response(
                    status=400,
                    data="Error retrieving conversation.",
                    custom_message=f"Error: {e}",
                )

            # clean up - this shouldnt happen
            if not conversation.llm_config:
                if not conversation.chat_history:
                    conversation.delete()
                    if config:
                        config.delete()

                return generate_response(
                    status=400,
                    data="Conversation has no config object, please send a config with this conversation to continue",
                    custom_message=None,
                )

            try:
                # please reference llm_config.py for list of available LLMs
                match conversation.llm_config.llm:
                    case "OPEN_AI":
                        llm = OpenAIWrapper(
                            api_key=conversation.llm_config.api_key,
                            chat_model=conversation.llm_config.chat_model,
                            system_instructions=conversation.llm_config.system_instructions,
                        )
                    case "CLAUDE":
                        llm = ClaudeWrapper(
                            api_key=conversation.llm_config.api_key,
                            chat_model=conversation.llm_config.chat_model,
                            system_instructions=conversation.llm_config.system_instructions,
                        )
                    case "MISTRAL":
                        llm = MistralWrapper(
                            api_key=conversation.llm_config.api_key,
                            chat_model=conversation.llm_config.chat_model,
                            system_instructions=conversation.llm_config.system_instructions,
                        )
                    case "HUGGINGFACE":
                        llm = HuggingWrapper(
                            api_key=conversation.llm_config.api_key,
                            chat_model=conversation.llm_config.chat_model,
                            system_instructions=conversation.llm_config.system_instructions,
                        )
                # print("llm go")
                # print(time.gmtime())
                # test to see if credentials and keys are valid
                if llm.authorize():
                    # set conversation history if it exists
                    if conversation.chat_history:
                        llm.set_conversation_history(
                            json.loads(conversation.chat_history)
                        )

                    temp, success = llm.send_text_chat(
                        message=prompt,
                        system_instructions=conversation.llm_config.system_instructions,
                    )

                    if not success:
                        return generate_response(
                            status=400,
                            data=str(temp),
                            custom_message="Error retrieving chat, please refer to logs.",
                        )
                    
                    # print("message sent")
                    # print(time.gmtime())
                    # update and save converstaion conversation.chat_history=json.dumps(temp["chat_history"])
                    ch = temp["chat_history"]
                    if not ch[0]["role"] == "system":
                        ch.insert(
                            0,
                            {
                                "role": "system",
                                "content": conversation.llm_config.system_instructions,
                            },
                        )

                    conversation.chat_history = json.dumps(ch)

                    conversation.total_tokens += int(temp["tokens"])
                    match conversation.llm_config.llm:
                        case "OPEN_AI":
                            if conversation.llm_config.chat_model == "gpt-3.5-turbo":
                                conversation.gpt3_tokens += int(temp["tokens"])
                            else:
                                conversation.gpt4_tokens += int(temp["tokens"])
                        case "CLAUDE":
                            conversation.claude_tokens += int(temp["tokens"])
                        case "MISTRAL":
                            conversation.mistral_tokens += int(temp["tokens"])
                        case "HUGGINGFACE":
                            if (
                                conversation.llm_config.chat_model
                                == "meta-llama/Llama-2-70b-chat-hf"
                            ):
                                conversation.llama2_tokens += int(temp["tokens"])
                            else:
                                conversation.hugging_other_tokens += int(temp["tokens"])

                    conversation.save()
                    # create message
                    msg = apps.get_model("aiModule.Message").objects.create(
                        prompt=prompt,
                        response=str(temp["response"]),
                        generated_reply=temp["reply"],
                        conversation=conversation,
                        owner=user.profile,
                        total_tokens=temp["tokens"],
                        llm=conversation.llm_config.llm,
                        chat_model=conversation.llm_config.chat_model,
                    )

                else:

                    if not conversation.chat_history:
                        conversation.delete()
                        if config:
                            config.delete()

                    return generate_response(
                        status=403, data="Invalid Credentials", custom_message=None
                    )

            except Exception as e:
                if not conversation.chat_history:
                    conversation.delete()
                    if config:
                        config.delete()

                print(f"Error generating ai chat completion: {e}")
                return generate_response(
                    status=500,
                    data=str(e) + ".",
                    custom_message="Error generating chat completion",
                )

            ret = MessageSerializer(msg).data
            return generate_response(status=200, data=ret, custom_message=None)

        except Exception as e:
            print(f"error generating chat completion:{e}")
            return generate_response(status=500, data=str(e) + ".", custom_message=None)
