import { Spinner } from "react-bootstrap";

function Loader(props) {
    return (
        <div>
            <Spinner
                animation='border'
                role='status'
                style={{
                    width: '100px',
                    height: '100px',
                    margin: 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
}

export default Loader;