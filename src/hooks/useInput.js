// import {useState} from "react";
import useLocalStorage from "./useLocalStorage";

// 7.4.0 Let's create another custom hook for the input, and we'll start with the pattern much like we had started with before at "useLocalStorage" hook — creating state and passing "initValue" to it.
const useInput = (key, initValue) => {
  // 7.6.0 However, we're missing our localStorage for the input, and that wasn't a very good test. Sure, we can type into the form, but nothing happens. So, let's use these hooks together. The great thing about React hooks is that we can use one hook inside another. We'll import a custom hook, "useLocalStorage", and add "key" to the parameters that "useInput" accepts. Then, we'll replace "useState" with "useLocalStorage", passing "key" to it as well. And that's all what we have to fix here to take advantages of the local storage as well.
  // (Go to [src/components/Login.js])
  // const [value, setValue] = useState(initValue);
  const [value, setValue] = useLocalStorage(key, initValue);

  // 7.4.1 But then we also need a "reset" func here that will update the state with "initValue".
  const reset = () => setValue(initValue);

  // 7.4.2 Next, we'll need "attributeObj" because we end up setting attributes with the object for the input. Inside we'll have "value: value" short written just "value" and then also "onChange" event listener, where we use "setValue" method to set the value to the "event.target.value". Now, these are like the attributes we would normally set on the input, when we set the value and the "onChange" event. We're just setting them in an attribute object.
  const attributeObj  = {
    value,
    onChange: (evt) => setValue(evt.target.value),
  };

  // 7.4.3 We'll return here "value", "reset" func and "attributeObj" object. And that's it for this hook, so time to apply it to the Login component.
  // (Go to [src/components/Login.js])
  return [value, reset, attributeObj];
};

export default useInput;