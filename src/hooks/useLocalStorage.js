import {useEffect, useState} from "react";
// 7.0.0 In this tutorial we're going to add custom hooks to our React Login Form and the great thing about these React hooks is they abstract logic from the Login component, so we can use them in future projects too. After we finish this one a user could write his account name into the Login form, refresh page or go to another page and come back to the login page, the name will be still there.

// 7.3.0 Let's add some more functionality to our custom hook, so we can use it in other projects as well. We'll create another func "getLocalValue" that accepts "key" & "initValue" as parameters.
const getLocalValue = (key, initValue) => {
  // 7.3.1 We figure out what we could put in here and first consideration is if we're not just using React but maybe something like Next.js (Server Side React). So if it's running on the server we're not going to have the window object, and we need to consider that. So, by writing this check we'll avoid possible problems while using this hook in Next.js.
  // SSR Next.js
  if (typeof window === "undefined") return initValue;

  // 7.3.2 A second issue that might arise is when the value is already stored. In that case, we can't set it the way we did below, so we do it differently:
  // if a value already stored
  const storedValue = localStorage.getItem(key);

  if (storedValue !== null && storedValue !== "undefined") {
    try {
      return JSON.parse(storedValue);
    } catch (err) {
      console.error(`Error parsing localStorage item "${key}":`, err);
    }
  }

  // 7.3.3 Next consideration will be if we need to return the result of a function, then we'll make a check for "initValue" is instance of Function, then we'll be calling "initValue" function and return its result.
  // return result of a function
  if (initValue instanceof Function) return initValue();

  // 7.3.4 Otherwise, in the end we'll just return "initValue". ↓
  return initValue;
};

// 7.1.0 First, let's create this custom hook. We'll start by creating a simple version of the hook, which is all we need for our form. Later, we'll look at how to expand it so that we can use it in other projects. First, we'll create a "value" state with the "useState" hook and pass in "JSON.parse" because we'll be parsing the data we pull from localStorage. To retrieve a value from localStorage, we'll use "getItem", passing the name or key of its record. Let's call the variable "key", which will be the initial value for that state. Another possibility is "initValue", which is the string passed directly in the case that localStorage is empty. We'll also need them as the params for "useLocalStorage" func, of course.
const useLocalStorage = (key, initValue) => {
  // const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)) || initValue);
  // 7.3.5 After we've done with creating func "getLocalValue" to expand our hook with the new additional options, let's implement it here. So, instead of just "JSON.parse" we'll use an anonymous arrow func, where we return "getLocalValue" func.
  // (Go to [src/hooks/useInput.js])
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initValue);
  });

  // 7.1.1 We will also need to use the "useEffect" hook here, setting the "key" and "value" as dependencies. We'll set the localStorage inside it where we have to pass the "key" and the "value" state as the value for localStorage record.
  useEffect(() => {
    if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // 7.1.2 And we have to return both the state, and it's function-updater.
  return [value, setValue];
};

// ? 7.1.3 Now, that was a very simple version of this custom hook. We know we're going to receive string data from user input, so we'll have a username. If you're only receiving string data, this would work. However, we'll expand this later.
// (Go to [src/components/Login.js])

export default useLocalStorage;