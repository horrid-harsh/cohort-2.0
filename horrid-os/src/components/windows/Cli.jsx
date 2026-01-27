import Terminal from 'react-console-emulator';
import MacWindow from './MacWindow';
import './cli.scss'

const Cli = ({ windowName, windowProps }) => {

    const commands = {
        about: {
            description: 'About me',
            usage: 'about',
            fn: () => 'I am a full-stack web developer passionate about building modern web applications with React, Node.js, and cloud technologies.'
        },
        skills: {
            description: 'List technical skills',
            usage: 'skills',
            fn: () => `Frontend: React, Vue.js, Vanilla JS, Sass, HTML/CSS
Backend: Node.js, Express, Python, Django
Databases: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, Webpack, Vite
Cloud: AWS, Azure, Heroku`
        },
        projects: {
            description: 'View my projects',
            usage: 'projects',
            fn: () => `1. Portfolio Website - React + Vite
2. E-commerce Platform - MERN Stack
3. Task Management App - Next.js
4. Real-time Chat App - Socket.io
5. Data Dashboard - React + Chart.js`
        },
        experience: {
            description: 'Display work experience',
            usage: 'experience',
            fn: () => `Senior Developer @ Tech Corp (2022 - Present)
  - Led development of 5+ React applications
  - Mentored junior developers

Full Stack Developer @ Web Solutions (2020 - 2022)
  - Built scalable APIs with Node.js
  - Designed responsive UIs with React`
        },
        contact: {
            description: 'Get contact information',
            usage: 'contact',
            fn: () => `Email: ankur@example.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA`
        },
        github: {
            description: 'Open GitHub profile',
            usage: 'github',
            fn: () => {
                window.open('https://github.com', '_blank')
                return 'Opening GitHub...'
            }
        },
        resume: {
            description: 'Download resume',
            usage: 'resume',
            fn: () => 'Resume download started...'
        },
        social: {
            description: 'View social media links',
            usage: 'social',
            fn: () => `Twitter: @ankurdev
LinkedIn: /in/ankurprajapati
Portfolio: ankurprajapati.dev`
        },
        echo: {
            description: 'Echo a passed string',
            usage: 'echo <string>',
            fn: (...args) => args.join(' ')
        }
    }

    const welcomeMessage = `
╔════════════════════════════════════════╗
║     Welcome to My Portfolio CLI!       ║
╚════════════════════════════════════════╝

Hello! 👋 Welcome to my interactive portfolio. You can navigate through my work experience, skills, and projects using terminal commands.

Type 'help' to see all available commands, or try:
  • about     - Learn about me
  • skills    - View my technical skills
  • projects  - Check out my work
  • experience - See my career history
  • contact   - Get in touch

Happy exploring! 🚀
`
  return (
    <MacWindow windowName={windowName} windowProps={windowProps}>
        <div className="cli-window">
            <Terminal 
                commands={commands}
                welcomeMessage={welcomeMessage}
                promptLabel={'harshwardhan:~$'}
                
                /* docs-based visual customization */
                backgroundColor="#242424"
                textColor="#e5e5e5"
                promptLabelStyle={{ color: '#00ff00' }}
                inputTextStyle={{ color: '#ffffff' }}
                outputTextStyle={{ color: '#d1d5db' }}

                /* docs-based behavior customization */
                hideTopBar
                autoFocus
                commandPassThrough={(cmd) => `command not found: ${cmd}`}
            />
        </div>
    </MacWindow>
  )
}

export default Cli