import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, changeByVal } from '../../../redux/counterSlice';
import { useState } from 'react';

export default function Counter() {
    const count = useSelector(state => state.counter.count);
    const [value, setValue] =  useState('');
    const dispatch = useDispatch();

    const handleInc = () => {
        dispatch(increment());
    }

    const handleDec = () => {
        dispatch(decrement());
    }

    const handleChange = () => {
        dispatch(changeByVal({value: Number(value)}));
    }

    return(
        <>
            <h1>Current count: {count}</h1>
            <button onClick={handleInc}>increment</button>
            <button onClick={handleDec}>decrement</button>
            <label htmlFor="value"></label>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
            <button onClick={handleChange}>change</button>
        </>
    )
}