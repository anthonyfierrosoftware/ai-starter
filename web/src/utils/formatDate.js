export const formatDate = (inputDate) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateObj = new Date(inputDate);
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const formattedDate = `${month} ${day}, ${year} at ${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;

  return formattedDate;
};
