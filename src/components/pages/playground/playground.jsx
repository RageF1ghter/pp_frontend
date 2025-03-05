import Calculator from "./calculator";
import Facts from "./facts";
import Images from "./images";
import Validator from "./validator";
import { Link, Route, Routes } from 'react-router-dom';
import "./playground.css"


function Playground() {

    const functions = [
        { name: 'Calculator', path: 'calculator' }, 
        { name: 'Facts', path: 'facts' }, 
        { name: 'Images', path: 'images' },
        { name: 'Validator', path: 'validator' }
    ];

    return (
        <div>
            <Routes>
                <Route path="/" element={<h1>Pick the function!</h1>}/>
                <Route path="calculator" element={<Calculator />} />
                <Route path="facts" element={<Facts />} />
                <Route path="images" element={<Images />} />
                <Route path="validator" element={<Validator/>} />
            </Routes>
            <div className="functions">
                {functions.map((func, index) => (
                    <div className="function-card" key={index}>
                        <Link to={`/playground/${func.path}`}>{func.name}</Link>
                    </div>
                ))}
            </div>

            
        </div>
    )
}

export default Playground;