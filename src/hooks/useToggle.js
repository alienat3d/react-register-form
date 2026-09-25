import useLocalStorage from "./useLocalStorage";

// 7.7.0 Now, we wouldn't have to use "useLocalStorage" with this hook, but we're doing that to remember to trust the device or not. That's what those checkbox on the Login page doing.
// 7.7.1 So, nothing really new about this hook, it also accepts "key" & "initValue".
const useToggle = (key, initValue) => {
  // 7.7.2 Then, we'll start off as if we were creating a standard "value" state, but using "useLocalStorage" instead of "useState".
  const [value, setValue] = useLocalStorage(key, initValue);

  // 7.7.3 And we'll need to define "toggle" func that accepts "value" and inside we'll be using state updater func "setValue", which takes the previous state and will be returning either a value or the opposite what the previous state was, depending on if the data type of "value" is boolean or not.
  const toggle = (value) => setValue(prev => {
    return typeof value === "boolean" ? value : !prev;
  });

  // 7.7.4 We'll be returning "value" and "toggle" func here.
  // (Go to [src/components/Login.js])
  return [value, toggle];
};

export default useToggle;