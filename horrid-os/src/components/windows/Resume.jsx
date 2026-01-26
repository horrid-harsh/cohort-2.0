import MacWindow from './MacWindow';
import './resume.scss';

const Resume = ({ windowName, setWindowsState }) => {
  return (
    <MacWindow windowName={windowName} windowState={setWindowsState} >
        <div className='resume-window'>
            <embed src="/Resume-MERN_v2.pdf"></embed>    
        </div>
    </MacWindow>
  )
}

export default Resume