import Modal from "../../../../app/components/Modal"
import React, { forwardRef, useImperativeHandle, useState } from "react"
import { translate, Translate } from "react-i18nify"
import "./ModalVersionInfo.scss"
import Logo from "../../images/icons/logo.png"
import { SIZE_EXTRA_WIDE } from "../../../../app/components/Card"
import packageInfo from "../../../../../package.json"
import { BUILD_TIMESTAMP } from "app/utils/constants"
import { useVrmStore, useAppStore } from "@elninotech/mfd-modules"
import { observer } from "mobx-react"
import { useMqtt } from "@elninotech/mfd-modules"
import SelectorButton from "../SelectorButton"

export const ModalVersionInfo = observer(
  forwardRef((_, ref) => {
    const [isOpen, setOpen] = useState(false)
    const { portalId = "-", siteId = "-" } = useVrmStore()
    const { humanReadableFirmwareVersion } = useAppStore()
    const { publish } = useMqtt()
    const [inactiveButton, setInactiveButton] = useState<null | "run" | "clear">(null)

    const handleRunChargeScheduling = () => {
      publish("Cerbomoticzgx/EnergyBroker/RunTrigger", "True", { retain: false })
    }

    const handleClearChargeSchedule = () => {
      publish("Cerbomoticzgx/EnergyBroker/ClearSchedule", "True", { retain: false })
    }

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
    }))

    return (
      <>
        {isOpen && (
          <Modal
            cardProps={{
              size: SIZE_EXTRA_WIDE,
              className: "metric modal-marine-card",
            }}
            onClose={() => setOpen(false)}
            title={translate("header.versionInfo")}
          >
            <div className="modal-ver-container">
              <div className="left-info">
                <div className="left-info-content">
                  <img src={Logo} alt="Marine logo" />
                  <div className="version-item">
                    <Translate
                      value="versionInfo.version"
                      version={`${packageInfo.version} ${process.env.REACT_APP_WHITELABEL}`}
                    />
                  </div>
                </div>
              </div>
              <div className="right-info">
                <div className="first-column">
                  <p>
                    <Translate value="versionInfo.buildDate" />
                  </p>
                  <p>
                    <Translate value="versionInfo.venusOs" />
                  </p>
                  <p>
                    <Translate value="versionInfo.identifier" />
                  </p>
                  <p>
                    <Translate value="versionInfo.vrmPortID" />
                  </p>
                </div>
                <div className="second-column">
                  <p>{BUILD_TIMESTAMP}</p>
                  <p>{humanReadableFirmwareVersion}</p>
                  <p>{portalId}</p>
                  <p>{siteId}</p>
                </div>
              </div>
            </div>

            {/* New Button Section */}
            <div className="modal-action-buttons">
              <SelectorButton
                active={inactiveButton !== "run"}
                onClick={() => {
                  setInactiveButton("run")
                  handleRunChargeScheduling()
                  setTimeout(() => setInactiveButton(null), 750)
                }}
              >
                Run Charge Scheduling
              </SelectorButton>
              <SelectorButton
                active={inactiveButton !== "clear"}
                onClick={() => {
                  setInactiveButton("clear")
                  handleClearChargeSchedule()
                  setTimeout(() => setInactiveButton(null), 750)
                }}
              >
                Clear Charge Schedule
              </SelectorButton>
            </div>
          </Modal>
        )}
      </>
    )
  })
)
