export default function Loader({ size = "normal" }) {
  return (
    <div className={`loader_container ${size}`}>
      <span className="loader"></span>
    </div>
  );
}
