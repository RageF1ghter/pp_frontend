import { useState } from 'react';
import { useSelector } from 'react-redux';
import Details from './details';

const USER_ID = '67a28b8829f3ba8beda0e216';
const Spend = () => {
    const [category, setCategory] = useState('');
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const userId = useSelector((state) => state.auth.userId) || USER_ID;
    console.log(userId);


    const handleSybmit = async (e) => {
        e.preventDefault();
        const date = new Date().toLocaleString();
        const amountFloat = parseFloat(amount);
        if(category === '' || amountFloat <= 0.0){
            alert('Please enter valid category and amount!');
            return;
        }else{
            const spendingObject = {
                userId,
                category,
                details,
                amount,
                date
            }
            console.log(spendingObject);

            try{
                const res = await fetch('http://localhost:5000/spend/add', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(spendingObject)
                })
                if(res.ok){
                    alert('Spending record added successfully!');
                    setCategory('');
                    setDetails('');
                    setAmount('');
                }
            }catch(error){
                console.log(error);
            }

            
        }
    }
    return (
        <>
            <h1>This is spending summary page</h1>
            <div className="input">
                <form onSubmit={handleSybmit}>
                    <label htmlFor="category">Category: </label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)}/>
                    <label htmlFor="detail">Detail: </label>
                    <input type="text" id="detail" value={details} onChange={e => setDetails(e.target.value)}/>
                    <label htmlFor="amount">Amount: </label>
                    <input type="text" id="amount" value={amount} onChange={e => {setAmount(e.target.value)}}/>
                    <button type="submit">Enter</button>
                </form>
            </div>
            <Details userId={userId}/>


            
        </>
        
    )
}

export default Spend;