import { useState } from "react";

export default function Form({handleSubmit}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Please fill all the fields");
            return;
        } else {
            handleSubmit({ name, email, id: Date.now() });
            setName("");
            setEmail("");
        }
    }
    return (
        <form onSubmit={submit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    )
}