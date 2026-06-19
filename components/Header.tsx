import Image from "next/image";

const Header = () => {

    return (
      <div className="flex flex-row gap-4 items-center pt-6 px-8 grow-0 justify-between">
        <div className="flex flex-row gap-4 items-center grow-0 min-w-0">
          <Image
            src="/360DialogLogo.png"
            alt="360dialog logo"
            width={140}
            height={60}
            className="shrink-0"
          />
          <h1 className="hidden lg:block text-xl font-bold text-gray-300 mb-1 whitespace-nowrap">
            Explore Integrated Onboarding
          </h1>
        </div>
        <div className="flex flex-row items-center gap-2 shrink-0">
          <a
            className="text-sm text-blue-500 px-3 py-1 outline-none hover:text-blue-700 whitespace-nowrap"
            href="https://docs.360dialog.com/partner/onboarding/integrated-onboarding/connect-button"
            target="_blank"
            rel="noreferrer"
          >
            Documentation →
          </a>
          <a
            className="text-sm text-gray-400 px-3 py-1 outline-none hover:text-gray-500 whitespace-nowrap"
            href="https://www.360dialog.com/contact#dataprivacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy →
          </a>
        </div>
      </div>
    );
}

export default Header