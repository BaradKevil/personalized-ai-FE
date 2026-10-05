import { KiboriLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame" style={{ width: "100%", height: "100vh" }}>
      <KiboriLandingPage />
    </div>
  );
}

export default Scene;
