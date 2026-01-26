import MacWindow from './MacWindow';
import './resume.scss';

const Resume = ({ windowName, setWindowsState, topZIndex, setTopZIndex }) => {
  return (
    <MacWindow windowName={windowName} windowState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} >
        <div className='resume-window'>
            <embed src="/Resume-MERN_v2.pdf"></embed>    
        </div>
    </MacWindow>
  )
}

export default Resume