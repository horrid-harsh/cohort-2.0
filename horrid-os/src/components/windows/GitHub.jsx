import MacWindow from "./MacWindow";
import githubData from "../../assets/github.json";
import './github.scss'

const GitCard = ({ data }) => {
  return (
    <div className="card">
      <img src={data.image} alt="" />
      <h1>{data.title}</h1>
      <p className="description">{data.description}</p>
      <div className="tags">
        {data.tags.map((tag, idx) => (
          <p key={idx} className="tag">{tag}</p>
        ))}
      </div>
      <div className="urls">
        <a href={data.repoLink}>Repository</a>
        {data.demoLink && <a href={data.demoLink}>DemoLink</a>}
      </div>
    </div>
  );
};

const GitHub = ({ windowName, setWindowsState, topZIndex, setTopZIndex  }) => {
  return (
    <MacWindow windowName={windowName} setWindowsState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} >
      <div className="cards">
        {githubData.map((project) => {
          return <GitCard key={project.id} data={project} />;
        })}
      </div>
    </MacWindow>
  );
};

export default GitHub;
