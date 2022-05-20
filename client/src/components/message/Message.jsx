import "./message.css";

export default function Message({ own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://i.pinimg.com/550x/50/e1/32/50e132e0876f58632bbac562b916e180.jpg"
          alt=""
        />
        <p className="messageText">
          Řekl jsem mámě, že nedodělám školu. Jenom mě brzdí. A netrap se kvůli
          tomu, dělám to proto, aby sme byli štastný. Řekl jsem si: "Jakube,
          jedinej, komu můžeš věřit, je Jakub." A říkal jsem, že by si mě
          nechtěla, že já nejsem dobrej přítel
        </p>
      </div>
      <div className="messageBottom">1 hour ago</div>
    </div>
  );
}
