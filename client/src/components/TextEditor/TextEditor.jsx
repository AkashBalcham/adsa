import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
const Rope = require('../../utils/ROPE');


const TextEditor = () => {
    


    let text = Rope("");

    

    const [ theme, setTheme ] = useState("");
    const [ editText, setEditText ] = useState(text.toString());
    const [ isShowingInstructions, setIsShowingInstructions ] = useState(false);
    const [ pointer, setPointer ] = useState(0);

    const [meals, setMeals] = useState([])

    useEffect(() => {
        const fetchMeals = async () => {        // MealDB
            try {
              const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=banana');
              if (!response.ok) {
                throw new Error('Failed to fetch data');
              }
              const data = await response.json();
              setMeals(data.meals);
              console.log(meals);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
        };
        // fetchMeals();

        const fetchMeals2 = async () => {
            try {
                const api_id = "17526970"
                const api_key = "c1d8109ef47fe57295d498b14d46645f"
                const response = await fetch('https://api.edamam.com/search?q=banana&api_id=17526970&api_key=c1d8109ef47fe57295d498b14d46645f');
                if (!response.ok) {
                  throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setMeals(data.meals);
                console.log(meals);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
        }

        fetchMeals2();
    }, []);


    const getPosition = () => {
        const editor = document.getElementById("editor");
        setPointer(editor.selectionStart);
        return editor.selectionStart;
    }

    

    const insertSting = () => {
        text = Rope(editText);
        console.log("inserting...");
        const toBeInserted = document.getElementById("input-string").value;
        const startIndex = parseInt(document.getElementById("start-index").value, 10);
        console.log(startIndex, toBeInserted, text)
        if (isNaN(startIndex)) alert("Invalid index");
        else if (startIndex < 0 || startIndex > text.length) alert("Invalid index")
        else {
            try {
                text.insert(startIndex, toBeInserted);
                setEditText(text.toString());
    
            } catch (err) {
                alert("Error: ", err)
            }
        }
        // setEditText(text.toString());
    }

    const deleteString = () => {
        text = Rope(editText);
        const startIndex = parseInt(document.getElementById("start-index").value, 10);
        let endIndex = parseInt(document.getElementById("end-index").value, 10);
        if (isNaN(startIndex) || isNaN(endIndex)) alert("Invalid indices");
        else if (startIndex > endIndex) alert("Start is greater than end");
        else if (startIndex < 0 || startIndex > text.length) alert("Invalid index");
        else if (endIndex < 0) alert("Invalid index");

        else {
            try {
                if (endIndex > text.length) endIndex = text.length;
                console.log(startIndex, endIndex, text.toString());
                text.remove(startIndex, endIndex);
                setEditText(text.toString());
            } catch (err) {
                alert(err)
            }
        }
        // setEditText(text.toString());
    }

    const getSubstring = () => {
        text = Rope(editText);
        const startIndex = parseInt(document.getElementById("start-index").value, 10);
        const endIndex = parseInt(document.getElementById("end-index").value, 10);
        if (isNaN(startIndex) || isNaN(endIndex)) alert("Invalid indices");
        else if (startIndex > endIndex) alert("Start is greater than end")
        else {
            try {
                console.log(startIndex, endIndex, text.toString());
                const subString = text.substring(startIndex, endIndex);
                // console.log(subString);
                alert(("The substring between the given indices is: ") + ('"') + subString + ('"'));
                // alert(subString);
            } catch (err) {
                alert(err)
            }
        }
    }

    const updatePointerPosition = () => {
        setPointer(getPosition());
    }

    return (
        <div className={`${theme !== "" ? (theme + "-background") : ""} h-screen`}>
            <h1 className='text-7xl mb-4 shadow-sm w-full py-2'>Text Editor</h1>

            <div className='w-full flex flex-row justify-around items-center'>
                <button className='px-6 py-2 rounded-md border-[2px] border-solid border-[#957dad] hover:text-white hover:bg-[#957dad] duration-300'
                    onClick={() => {insertSting();}}
                    >
                        Insert
                </button>
                <button className='px-6 py-2 rounded-md border-[2px] border-solid border-[#957dad] hover:text-white hover:bg-[#957dad] duration-300'
                    onClick={() => {deleteString();}}
                >
                    Delete
                </button>
                <button className='px-6 py-2 rounded-md border-[2px] border-solid border-[#957dad] hover:text-white hover:bg-[#957dad] duration-300'
                    onClick={() => {getSubstring();}}
                >
                    Substring
                </button>
            </div>

            <div className='flex flex-row justify-between items-center mt-20' id="inputs">
                <div className='w-[50%]'>
                    <input id="input-string" autoComplete='off' type="text" placeholder='string' className='px-2 py-2 rounded-md border-[2px] border-solid border-[#957dad]'/>
                </div>

                <div className='w-[50%] flex flex-row justify-evenly items-center'>
                    <input type="number" placeholder="start-position" className="py-2 px-2 rounded-md border-[2px] border-solid border-[#957dad]" id='start-index'/>
                    <input type="number" placeholder="end-position" className="py-2 px-2 rounded-md border-[2px] border-solid border-[#957dad]" id='end-index'/>
                </div>
            </div>


            <div className="text-black mt-20 flex flex-col">
                
                <h1 className='text-md font-extralight'>Current pointer position: <span className='font-bold'>{ pointer }</span></h1>
                

                <textarea 
                    placeholder='Start typing...'
                    // value={ fileData } 
                    value={editText} 
                    id="editor" 
                    className={`p-4 text-xl ml-auto mr-auto w-[80%] border-[3px] border-solid border-[#957dad] ${theme}`}
                    name="" 
                    cols="30" 
                    rows="10"
                    // readOnly={=}
                    onClick={() => {
                        updatePointerPosition();
                    }}
                    
                />
                
                <div className='flex flex-row justify-center items-center mt-16'>
                    <button className='px-6 py-2 rounded-md border-[2px] border-solid border-[#957dad] hover:text-white hover:bg-[#957dad] duration-300'
                        onClick={() => {setIsShowingInstructions(true)}}
                    >
                        Instructions
                    </button>
                </div>
            
            </div>



            <Modal centered="true" show={isShowingInstructions}>
                <Modal.Header>
                    <Modal.Title >
                        <h1 className='text-[#957dad] text-center '>
                            Instructions
                        </h1>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        <span className='text-4xl pl-8'>
                            We have 3 operations
                        </span>
                        <ul className='text-sm mt-2'>
                            <li>
                                <span className='text-2xl'>Insert</span>: This takes the string and inserts it at the <strong>start index</strong>. The <strong>end-index</strong> is <strong>NOT</strong> considered here.
                            </li>
                            <hr />
                            <li>
                                <span className='text-2xl'>Delete</span>: This deletes the content between the start-index and end-index. The <strong>string input value</strong> is <strong>NOT</strong> considered here.
                            </li>
                            <hr />
                            <li>
                                <span className='text-2xl'>Substring</span>: This gets the section of the string between the start and end indices. The <strong>string input value</strong> is <strong>NOT</strong> considered here.
                            </li>
                        </ul>

                        <ul>
                            <li className='font-bold text-center text-2xl'>**</li>
                            <li className='text-center'> Clicking on each of the buttons will perform the operation and update the textarea</li>
                        </ul>
                    </p>                     
                    
                        

                </Modal.Body>

                <Modal.Footer>
                    <div className='w-full flex flex-row items-center justify-center'>
                        <button 
                            className='px-6 py-2 rounded-md border-[2px] border-solid border-[#957dad] hover:text-white hover:bg-[#957dad] duration-300'
                            onClick={() => {setIsShowingInstructions(false)}}
                        >
                            Close
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default TextEditor;