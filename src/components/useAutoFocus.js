import { useEffect, useRef } from 'react';

const useAutoFocus = (isSelectText = false) => {
    // Use a ref so that the value doesn't change and useEffect doesn't need a dependency
    const selectValue = useRef(isSelectText);
    // Ref that will be passed to the input element
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            // This will highlight and select text if there is some. Useful for editing
            if (selectValue.current) {
                inputRef.current.select();
            }
        } else {
            console.error("Auto focus did not work");
        }
    }, []);

    // Return inside an object so we can easily deconstruct
    return { ref: inputRef }
}

export default useAutoFocus;
