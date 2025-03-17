import { useState } from 'react';
import { useSelector } from 'react-redux';
import Details from './details';
import '../style.css';

const USER_ID = '67a28b8829f3ba8beda0e216';
const Spend = () => {
    const [category, setCategory] = useState('');
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const userId = useSelector((state) => state.auth.userId) || USER_ID;
    console.log(userId);


    const handleSybmit = async (e) => {
        e.preventDefault();
        if(date === ''){
            date = new Date().toLocaleString();
        }else{
            console.log(date);
        }
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
            <div className="flex justify-center min-h-screen items-center bg-gray-100">
            <form 
                onSubmit={handleSybmit} 
                className="input-form flex flex-col bg-sky-100/60 p-8 rounded-lg shadow-md border border-sky-300 w-96"
            >
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="category" className="font-serif text-gray-700">Category:</label>
                    <input 
                        type="text" 
                        id="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="border-2 border-sky-300 w-3/4 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="detail" className="text-gray-700">Detail:</label>
                    <input 
                        type="text" 
                        id="detail" 
                        value={details} 
                        onChange={e => setDetails(e.target.value)}
                        className="border-2 border-gray-300 w-3/4 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="amount" className="text-gray-700">Amount:</label>
                    <input 
                        type="text" 
                        id="amount" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)}
                        className="border-2 border-gray-300 w-3/4 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                <label htmlFor="date" className="text-gray-700">Date:</label>
                <input 
                    type="date" 
                    id="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="border-2 border-gray-300 w-3/4 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                </div>

                <button 
                type="submit" 
                className="mt-4 bg-blue-500 text-white py-2 w-3/4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                Enter
                </button>
            </form>
            </div>
            <Details userId={userId}/>


            
        </>
        
    )
}

export default Spend;