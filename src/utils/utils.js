export const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (let key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

export const sortPasswordsByDate = (passwordsArray, direction = "asc") => {
  return passwordsArray.sort((a, b) => {
    const date = new Date(a.date);
    const nextDate = new Date(b.date);
    if (direction === "asc") {
      return date - nextDate;
    } else {
      return nextDate - date;
    }
  });
};

export const sortPasswordsByDateNew = (passwordsArray) => {
  let direction = "asc";

  return function toggleSort() {
    direction = direction === "asc" ? "desc" : "asc";
    return passwordsArray.sort((a, b) => {
      const date = new Date(a.date);
      const nextDate = new Date(b.date);
      return direction === "asc" ? date - nextDate : nextDate - date;
    });
  };
};

export const searchBySavedPassword = (items, searchTerm) => {
  return items.filter((item) => {
    return item.savedPassword.toLowerCase().includes(searchTerm.toLowerCase());
  });
};
