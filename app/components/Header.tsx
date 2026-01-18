import { type FC, Suspense } from "react";
import LogoLink from "app/components/LogoLink";
import VoiceSelector from "app/components/VoiceSelector/VoiceSelector";
import { NewTabIcon } from "./icons/NewTabIcon";

interface Props {
  logoHref: string;
}

const DEPLOY_URL = "https://render.com/deploy?repo=https://github.com/ojusave/deepgram-voice-agent-demo";

const Header: FC<Props> = ({ logoHref }) => {
  const title = "Deepgram Voice Agent Demo";

  return (
    <>
      <header className="flex md:hidden m-4 items-center justify-between">
        <LogoLink href={logoHref} />
        <a
          href={DEPLOY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded-md transition-colors flex items-center gap-1.5 border border-gray-700"
        >
          Deploy on Render
          <NewTabIcon className="w-3 h-3" />
        </a>
      </header>
      <header className="hidden md:flex mx-10 my-8 items-center justify-between">
        <div className="flex-1">
          <LogoLink href={logoHref} />
        </div>
        <div className="flex-1 md:block hidden text-center">
          <h2 className="h-10 leading-10 font-favorit align-middle text-gray-25">{title}</h2>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          <a
            href={DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg transition-colors flex items-center gap-2 border border-gray-700"
          >
            Deploy on Render
            <NewTabIcon className="w-4 h-4" />
          </a>
          <Suspense>
            <VoiceSelector className="flex items-center" showLabel />
          </Suspense>
        </div>
      </header>
    </>
  );
};

export default Header;
