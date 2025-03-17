import * as yup from "yup";
import {useState} from "react";

export default function Validator() {
    const [result,setResult] = useState('');
    const commonSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(8).required(),
        url: yup.string().url().required(),
    });

    const passwordSchema = yup.object().shape({
        password: yup.string()
            .min(9, 'Password is too short - should be 9 chars minimum.')
            .matches(/[a-z]/, "Password must contain at least one lowercase character")
            .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    })

    async function validateCommon(data) {
        try {
            await commonSchema.validate(data);
            console.log("Validation successful:", data);
            setResult('passed');
          } catch (error) {
            console.log("Validation error:", error.message);
            setResult((error.message).toString());
        }
    }

    validateCommon({
        email: "ccc@gmail.com",
        password: '123456788',
        url: 'https://www.google.com'
    })

    return (
        <div>
            <h1>Validator</h1>
            <p>{result}</p>
        </div>
    )
}

