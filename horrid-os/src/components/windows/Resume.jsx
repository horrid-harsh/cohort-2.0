import MacWindow from './MacWindow';
import './resume.scss';

const Resume = ({ windowName, windowProps }) => {
  return (
    <MacWindow windowName={windowName} windowProps={windowProps} >
        <div className='resume-window'>
            <embed src="/Resume-MERN_v2.pdf"></embed>    
        </div>
    </MacWindow>
  )
}

export default Resume