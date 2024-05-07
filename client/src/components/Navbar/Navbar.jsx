import save from "../../assets/images/saveIcon.svg"
import upload from "../../assets/images/uploadFile.svg"
// import newFile from "../../assets/images/newFile.svg"
import downloadFile from "../../assets/images/download.svg"
import Tooltip from "react-bootstrap/Tooltip"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useRef, useEffect } from 'react';


const Navbar = ({ setFileName, setFileData, setIsCreatingFile }) => {
    useEffect(() => {
        fetch('')
    }, [])

    const tooltipUpload = (
            <Tooltip>
                <h1 className='text-sm'>Upload</h1>
            </Tooltip>
    );

    const tooltipDownload = (
        <Tooltip>
            <h1 className='text-sm'>Download</h1>
        </Tooltip>
    );

    const tooltipSave = (
        <Tooltip>
            <h1 className='text-sm'>Save</h1>
        </Tooltip>
    )

    const inputRef = useRef(null);

    const handleClick = () => {
        // 👇️ open file input box on click of another element
        inputRef.current.click();
    };

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];

        console.log(event.target.files[0]);
        if (!fileObj) {
        return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            console.log(fileContent);
            setFileData(oldData => (oldData + fileContent)); // Pass file content to TextEditor
        };
        reader.readAsText(fileObj);

        // console.log('fileObj is', fileObj);

        // 👇️ reset file input
        event.target.value = null;

        // 👇️ is now empty
        // console.log(event.target.files);

        // 👇️ can still access file object here
        // console.log(fileObj);
        // console.log(fileObj.name);
        setFileName(fileObj.name)
    };


    return (
        <nav className="shadow-lg flex flex-row items-center justify-between w-full fixed h-[9vh] px-8">
            <input
                style={{display: 'none'}}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
            />

            <div className="flex flex-row justify-between items-center text-2xl w-[6.5%] ">
                <OverlayTrigger placement='bottom' overlay={tooltipUpload}>
                    <button onClick={handleClick}><img className="w-[3rem]" src={upload} alt="Upload file" /></button>
                </OverlayTrigger>

                <OverlayTrigger placement='bottom' overlay={tooltipDownload}>
                    <button className='.nav-link' onClick={() => {setIsCreatingFile(true)}}> <img className="w-[2rem]" src={downloadFile} alt="New file" /> </button>
                </OverlayTrigger>
                
            </div>

            <div className='flex flex-row justify-end items-center w-[4%]'>
                <OverlayTrigger placement='bottom' overlay={tooltipSave}>
                    <button>
                        <img className="w-[2.5rem]" src={save} alt="" />
                    </button>
                </OverlayTrigger>
                
            </div>
        </nav>
    )
}

export default Navbar;