import { createPortal } from 'react-dom';

export default function Test() {
    return(


    <div>
        <p>This child is placed in the parent div.</p>
        {createPortal(
            <p>This child is placed in the document body.</p>,
            document.body
        )}
    </div>
    )
}