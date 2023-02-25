import { translate, Translate } from "react-i18nify"

import "./TibberGraph.scss"

const TibberGraph = ({ onClickOutsideContainer }) => (
  <div className="tibber-graph__container" onClick={onClickOutsideContainer}>
    <iframe
      className="tibber-graph"
      src={"https://tibber-graphs.s3-eu-west-1.amazonaws.com/prices.png"}
      title={translate("header.tibberGraph")}
    />
    <div className="text text--large tibber-graph__small_screen_info">
      <Translate value="header.remoteMessage" />
    </div>
  </div>
)

export default TibberGraph
