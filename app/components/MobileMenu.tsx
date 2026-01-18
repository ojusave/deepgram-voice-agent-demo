import { type FC, useState, useEffect, useRef } from "react";
import PopupBody from "app/components/PopupBody";
import InstructionInput from "app/components/InstructionInput";
import { XMarkIcon } from "app/components/icons/XMarkIcon";
import { BarsIcon } from "app/components/icons/BarsIcon";
import { NewTabIcon } from "app/components/icons/NewTabIcon";
import { useStsQueryParams } from "app/hooks/UseStsQueryParams";

const DEPLOY_URL = "https://render.com/deploy?repo=https://github.com/ojusave/deepgram-voice-agent-demo";

interface Props {
  hideInstructionInput?: boolean;
  className?: string;
}

enum Expansion {
  // For leaving the tray contents unmounted
  Closed = "Closed",
  // A "one-frame" state to render the tray while the component is offscreen
  Opening = "Opening",
  // The regular open state (including the initial transition)
  Open = "Open",
  // An ephemeral state to represent the time spent transitioning down before unmounting
  Closing = "Closing",
}
const { Closed, Opening, Open, Closing } = Expansion;

const MobileMenu: FC<Props> = ({ hideInstructionInput, className }) => {
  const { prompt } = useStsQueryParams();
  const [expansion, setExpansion] = useState<Expansion>(Closed);
  const closeButton = useRef<HTMLButtonElement>(null);

  const position = expansion === Open ? "translate-y-0" : "translate-y-full";

  useEffect(() => {
    if (expansion === Opening) {
      closeButton.current?.focus();
      setExpansion(Open);
    }
  }, [expansion]);

  const handleTransitionEnd = () => {
    if (expansion === Closing) setExpansion(Closed);
  };

  return (
    <div className={className}>
      <button
        className="p-3 border border-gray-700 rounded-lg text-2xl leading-none relative"
        onClick={() => setExpansion(Opening)}
      >
        <BarsIcon />
        {prompt && <span className="absolute right-2 top-1 text-sm text-green-spring">*</span>}
      </button>
      {expansion !== Closed && (
        <PopupBody onExit={() => setExpansion(Closing)}>
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`fixed bottom-0 left-0 w-full p-6 pb-14 border-t border-gray-700 bg-gray-850 transition-transform ${position}`}
          >
            <div className="flex justify-end">
              <button
                ref={closeButton}
                aria-label="Close"
                className="text-xl flex text-gray-350"
                onClick={() => setExpansion(Closing)}
              >
                <XMarkIcon />
              </button>
            </div>
            <div className="flex flex-col space-y-10">
              <a
                href={DEPLOY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="flex-grow text-left">Deploy on Render</span>
                <NewTabIcon className="w-4 h-4" />
              </a>
              {!hideInstructionInput && <InstructionInput focusOnMount={false} />}
            </div>
          </div>
        </PopupBody>
      )}
    </div>
  );
};

export default MobileMenu;
