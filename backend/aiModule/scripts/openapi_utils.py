import tiktoken
import uuid
import requests

def num_tokens_from_messages(messages, model="gpt-3.5-turbo"):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        print("Warning: model not found. Using cl100k_base encoding.")
        return False

    try:
        num_tokens = 0
        tokens_per_message = 4
        for message in messages:
            num_tokens += tokens_per_message
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))

        num_tokens += 3
        return num_tokens
    except Exception as e:
        print(f"error calulating num of tokens: {e}")

def save_image_from_url(image_url=None, save_to=f"vid-img-{uuid.uuid4()}.png"):
    '''
    this function saves an image from a url
    url: the images url
    save_to: the save target ex. "temp_1.png" if left bl;ank will gen a unique name
    '''
    try:
        img_data = requests.get(image_url).content
        with open(save_to, 'xb') as handler:
            handler.write(img_data)
    except Exception as e:
        print(f"Failed to save image error: {e}")
        