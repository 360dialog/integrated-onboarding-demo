import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "360dialog-connect-button";
import Head from "next/head";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import markup from "react-syntax-highlighter/dist/cjs/languages/prism/markup";
import prism from "react-syntax-highlighter/dist/cjs/styles/prism/prism";
import { dedent } from "ts-dedent";
import { useRouter } from "next/router";
import Select from "../components/Select";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("html", markup);

type CallbackObjectType = {
  client: string;
  channels: string[];
  revokedChannels?: string[];
};

type QueryParametersType = {
  email: string;
  clientName: string;
  redirectUrl: string;
  forwardState: string;
  next: string;
  planSelection: string;
  planName?: string;
  flow: string;
  ioSignature: string;
  ioTimestamp: string;
  preverifiedPhoneNumberId: string;
};

const demoPartnerId = "f167CmPA";

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [showScrollLabel, setshowScrollLabel] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollContainerHeight, setScrollContainerHeight] =
    useState<number>(2000);

  const [syncParamsOpen, setSyncParamsOpen] = useState<boolean>(false);
  const [clientDataOpen, setClientDataOpen] = useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  const [partnerId, setPartnerId] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [queryParametersState, setQueryParamatersState] =
    useState<QueryParametersType>({
      email: "",
      clientName: "",
      redirectUrl: "",
      forwardState: "",
      next: "",
      planSelection: "",
      flow: "",
      ioSignature: "",
      ioTimestamp: "",
      preverifiedPhoneNumberId: "",
    });
  const [callbackObject, setcallbackObject] = useState<CallbackObjectType>();
  const [copied, setCopied] = useState<boolean>(false);
  const [urlCopied, setUrlCopied] = useState<boolean>(false);
  const [vanillaCopied, setVanillaCopied] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  const handlePlanChange = (v: { name: string; label?: string }) => {
    setQueryParamatersState((queryParametersState) => ({
      ...queryParametersState,
      planSelection: v.name,
      planName: v.label,
    }));
  };

  const handleQueryParameterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQueryParamatersState((queryParametersState) => ({
      ...queryParametersState,
      [name]: value,
    }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setQueryParamatersState((queryParametersState) => ({
      ...queryParametersState,
      ...(name === "next" && { [name]: checked ? "login" : "" }),
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timeoutCopied = window.setTimeout(() => {
      setCopied(false);
      setUrlCopied(false);
      setVanillaCopied(false);
    }, 5000);

    return () => window.clearTimeout(timeoutCopied);
  }, [copied, urlCopied, vanillaCopied]);

  const handleCallback = (callbackObject: CallbackObjectType) => {
    /* The callback function returns the client ID as well as all channel IDs, for which you're enabled to fetch the API key via the Partner API */

    if (mounted) {
      setcallbackObject(callbackObject);

      console.log("Client ID: " + callbackObject.client);
      console.log("Channel IDs: " + callbackObject.channels);
      if (callbackObject.revokedChannels) {
        console.log("Revoked Channel IDs: " + callbackObject.revokedChannels);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).scrollTop < 10) {
      setshowScrollLabel(true);
    } else {
      setshowScrollLabel(false);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current != null) {
      setScrollContainerHeight(scrollContainerRef.current.clientHeight - 65);
    }

    // Set partner id from query parameter
    if (id) {
      setPartnerId(id as string);
    }
  }, [id]);

  const returnQueryParameterLiteral = (url?: boolean) => {
    const parameters = [
      { stateVar: "email", queryParam: "email" },
      { stateVar: "clientName", queryParam: "name" },
      { stateVar: "forwardState", queryParam: "state" },
      { stateVar: "redirectUrl", queryParam: "redirect_url" },
      { stateVar: "next", queryParam: "next" },
      { stateVar: "planSelection", queryParam: "plan_selection" },
      { stateVar: "flow", queryParam: "flow" },
      { stateVar: "ioSignature", queryParam: "io_signature" },
      { stateVar: "ioTimestamp", queryParam: "io_timestamp" },
      {
        stateVar: "preverifiedPhoneNumberId",
        queryParam: "preverified_phone_number_id",
      },
    ];

    var literalStringArr: string[] = [];

    parameters.forEach((v, idx) => {
      if (
        queryParametersState[v.stateVar as keyof QueryParametersType] !== ""
      ) {
        if (url) {
          literalStringArr.push(
            `${v.queryParam}=${
              queryParametersState[v.stateVar as keyof QueryParametersType]
            }`,
          );
        } else {
          literalStringArr.push(
            `${v.queryParam}: "${
              queryParametersState[v.stateVar as keyof QueryParametersType]
            }"`,
          );
        }
      }
    });

    if (literalStringArr.length > 0) {
      if (url) {
        return `${number ? "&" : "?"}${literalStringArr.join("&")}`;
      } else {
        return `queryParameters={{\n\t${literalStringArr.join(",\n\t")}\n}}`;
      }
    } else {
      return ``;
    }
  };

  const generateCodeSnippet = (): string => {
    let textBase = dedent(
      `<ConnectButton
        partnerId={${partnerId}}  // <-- Insert your partner ID here (or fill it in the input field on the left side)
        callback={() => {
          console.log("Client ID: " + callbackObject.client);
          console.log("Channel IDs: " + callbackObject.channels);
          if (callbackObject.revokedChannels) {
            console.log("Revoked Channel IDs: " + callbackObject.revokedChannels);
          }
        }}
        className=""  // <-- Insert your own styles via className definition or through inline styling
        label="${label ? label : "Create your WhatsApp Business Account"}"
        `,
    );

    if (number) {
      textBase = textBase.concat(`\nrequestedNumber="${number}"`);
    }

    const parameters = [
      { stateVar: "email", queryParam: "email" },
      { stateVar: "clientName", queryParam: "name" },
      { stateVar: "forwardState", queryParam: "state" },
      { stateVar: "redirectUrl", queryParam: "redirect_url" },
      { stateVar: "planSelection", queryParam: "plan_selection" },
      { stateVar: "flow", queryParam: "flow" },
      { stateVar: "ioSignature", queryParam: "io_signature" },
      { stateVar: "ioTimestamp", queryParam: "io_timestamp" },
      {
        stateVar: "preverifiedPhoneNumberId",
        queryParam: "preverified_phone_number_id",
      },
    ];

    var literalStringArr: string[] = [];

    parameters.forEach((v) => {
      if (
        queryParametersState[v.stateVar as keyof QueryParametersType] !== ""
      ) {
        literalStringArr.push(
          `${v.queryParam}: "${
            queryParametersState[v.stateVar as keyof QueryParametersType]
          }",`,
        );
      }
    });

    let queryParams = returnQueryParameterLiteral();
    if (queryParams !== ``) {
      textBase = textBase.concat("\n", queryParams);
    }

    return textBase.concat("\n/>");
  };

  const generateVanillaSnippet = (): string => {
    const env = partnerId === demoPartnerId ? "staging" : "prod";
    const buttonLabel = label ? label : "Create your WhatsApp Business Account";

    const vanillaParams: { stateVar: string; attr: string }[] = [
      { stateVar: "email", attr: "email" },
      { stateVar: "clientName", attr: "name" },
      { stateVar: "forwardState", attr: "state" },
      { stateVar: "redirectUrl", attr: "redirect-url" },
      { stateVar: "next", attr: "next" },
      { stateVar: "planSelection", attr: "plan-selection" },
      { stateVar: "flow", attr: "flow" },
      { stateVar: "ioSignature", attr: "io-signature" },
      { stateVar: "ioTimestamp", attr: "io-timestamp" },
      {
        stateVar: "preverifiedPhoneNumberId",
        attr: "preverified-phone-number-id",
      },
    ];

    const attrLines: string[] = [
      `  partner-id="${partnerId ? partnerId : "{partner_id}"}"`,
      `  label="${buttonLabel}"`,
      `  env="${env}"`,
    ];

    if (number) {
      attrLines.push(`  requested-number="${number}"`);
    }

    vanillaParams.forEach(({ stateVar, attr }) => {
      const value = queryParametersState[stateVar as keyof QueryParametersType];
      if (value) {
        attrLines.push(`  ${attr}="${value}"`);
      }
    });

    return [
      `<!-- From unpkg -->`,
      `<script src="https://unpkg.com/360dialog-connect-button/dist/dialog-connect-button.umd.js"></script>`,
      ``,
      `<dialog-connect-button`,
      ...attrLines,
      `></dialog-connect-button>`,
      ``,
      `<script>`,
      `  document.addEventListener('dialog-connect-callback', event => {`,
      `    console.log('Client ID:', event.detail.client);`,
      `    console.log('Channels:', event.detail.channels);`,
      `  });`,
      `</script>`,
    ].join("\n");
  };

  const generateSignupLink = (): string => {
    let textBase = `https://app.360dialog.com/onboarding/${partnerId ? partnerId : "{partner_id}"}`;

    if (number) {
      textBase = textBase.concat(`?number="${number}"`);
    }

    let queryParams = returnQueryParameterLiteral(true);
    if (queryParams !== ``) {
      textBase = textBase.concat("", queryParams);
    }

    return textBase;
  };

  return (
    <div className="w-screen lg:h-screen lg:overflow-hidden">
      <Head>
        <title>360dialog IO Demo</title>
        <meta
          name="description"
          content="360dialog Integrated Onboarding Demo Application"
        />
        <link rel="icon" href="/Logo.png" />
      </Head>

      <main className="w-screen lg:h-screen flex flex-col lg:overflow-hidden">
        <Header />

        <div className="flex flex-col pt-4 px-8 lg:grow lg:h-1/3">
          <div className="lg:h-1/3 lg:grow lg:overflow-x-auto pt-6 pb-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:h-full">
              <div
                className="overflow-auto relative w-full lg:w-1/4 lg:min-w-96 pr-6"
                onScroll={handleScroll}
                ref={scrollContainerRef}
              >
                <p className="text-md font-bold text-gray-700">Configure</p>
                <div className="relative flex flex-col px-2 py-8 gap-6 min-w-fit max-w-md">
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    General
                  </p>
                  <Input
                    label="Partner ID"
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    placeholder="Your Partner ID"
                    button={{
                      paddingRight: "pr-44",
                      component: (
                        <Button
                          disabled={partnerId === demoPartnerId}
                          onClick={() => setPartnerId(demoPartnerId)}
                        >
                          ← Insert Demo Partner
                        </Button>
                      ),
                    }}
                  />
                  <Input
                    label="Button Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    optional
                    placeholder="Create your WhatsApp Business Account"
                  />

                  <label className="inline-flex relative items-center justify-between cursor-pointer mt-2 pr-1">
                    <span className="block text-sm font-medium text-gray-500">
                      Show login
                    </span>
                    <input
                      type="checkbox"
                      name="next"
                      value={queryParametersState.next}
                      className="sr-only peer"
                      onChange={handleToggleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[26px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>

                  <div>
                    <div className="h-px w-full bg-gray-300 mt-9 mb-6" />
                    <button
                      type="button"
                      className="flex w-full items-center justify-between lg:cursor-default"
                      onClick={() => setSyncParamsOpen((o) => !o)}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        Synchronization Parameters
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 text-gray-500 transition-transform lg:hidden ${syncParamsOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div
                    className={`${syncParamsOpen ? "flex" : "hidden"} lg:flex flex-col gap-6`}
                  >
                    <Input
                      label="Redirect URL"
                      name="redirectUrl"
                      value={queryParametersState.redirectUrl}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                    <Input
                      label="State"
                      name="forwardState"
                      value={queryParametersState.forwardState}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                  </div>

                  <div>
                    <div className="h-px w-full bg-gray-300 mt-9 mb-6" />
                    <button
                      type="button"
                      className="flex w-full items-center justify-between lg:cursor-default"
                      onClick={() => setClientDataOpen((o) => !o)}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        Client Data
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 text-gray-500 transition-transform lg:hidden ${clientDataOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div
                    className={`${clientDataOpen ? "flex" : "hidden"} lg:flex flex-col gap-6`}
                  >
                    <Input
                      label="Number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      optional
                    />
                    <Input
                      label="Email"
                      name="email"
                      value={queryParametersState.email}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                    <Input
                      label="Name"
                      name="clientName"
                      value={queryParametersState.clientName}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                    <Select
                      label="Payment Plan"
                      name="planSelection"
                      selected={{
                        name: queryParametersState.planSelection,
                        label: queryParametersState.planName,
                      }}
                      onChange={handlePlanChange}
                      optional
                      options={[
                        // { name: "basic" },
                        { name: "regular", label: "Regular" },
                        { name: "premium", label: "Premium" },
                      ]}
                    />
                  </div>
                  <div>
                    <div className="h-px w-full bg-gray-300 mt-9 mb-6" />
                    <button
                      type="button"
                      className="flex w-full items-center justify-between lg:cursor-default"
                      onClick={() => setAdvancedOpen((o) => !o)}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        Advanced
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 text-gray-500 transition-transform lg:hidden ${advancedOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div
                    className={`${advancedOpen ? "flex" : "hidden"} lg:flex flex-col gap-6`}
                  >
                    <Input
                      label="Flow"
                      name="flow"
                      value={queryParametersState.flow}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                    <Input
                      label="IO Signature"
                      name="ioSignature"
                      value={queryParametersState.ioSignature}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                    <Input
                      label="IO Timestamp"
                      name="ioTimestamp"
                      value={queryParametersState.ioTimestamp}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                    <Input
                      label="Preverified Phone Number ID"
                      name="preverifiedPhoneNumberId"
                      value={queryParametersState.preverifiedPhoneNumberId}
                      onChange={handleQueryParameterChange}
                      optional
                    />
                  </div>

                  {showScrollLabel && (
                    <div
                      style={{ top: scrollContainerHeight + "px" }}
                      className="absolute z-20 left-1/2 -translate-x-1/2 flex flex-row gap-1 text-white bg-gray-800 rounded rounded-2xl pl-2 pr-4 py-1 text-xs drop-shadow-md whitespace-nowrap"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Scroll to reveal all parameters
                    </div>
                  )}
                  {/* <div
                  style={{ top: scrollContainerHeight + 115 + "px" }}
                  className="fixed z-10 bg-gradient-to-b from-transparent to-white h-12 w-1/2 max-w-md"
                /> */}
                </div>
              </div>

              <div className="flex flex-col lg:grow pr-6 lg:overflow-auto">
                <div className="flex flex-col lg:grow">
                  <p className="text-md font-bold text-gray-700 flex-none">
                    Preview
                  </p>
                  <div className="mt-2 p-6 bg-dots rounded-md lg:grow min-h-40 border border-gray-100 relative">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {mounted && (
                        <>
                          <ConnectButton
                            disabled={!partnerId}
                            partnerId={partnerId}
                            className="bg-gray-800 text-white hover:bg-gray-900 drop-shadow-xl rounded-md px-4 py-3 outline-none focus:ring focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                            label={
                              label
                                ? label
                                : "Create your WhatsApp Business Account"
                            }
                            callback={handleCallback}
                            env={
                              partnerId === demoPartnerId ? "staging" : "prod"
                            }
                            requestedNumber={number}
                            queryParameters={{
                              redirect_url: queryParametersState.redirectUrl
                                ? queryParametersState.redirectUrl
                                : window.origin,
                              ...(queryParametersState.forwardState && {
                                state: queryParametersState.forwardState,
                              }),
                              ...(queryParametersState.email && {
                                email: queryParametersState.email,
                              }),
                              ...(queryParametersState.clientName && {
                                name: queryParametersState.clientName,
                              }),
                              ...(queryParametersState.next && {
                                next: queryParametersState.next,
                              }),
                              ...(queryParametersState.planSelection && {
                                plan_selection:
                                  queryParametersState.planSelection,
                              }),
                              ...(queryParametersState.flow && {
                                flow: queryParametersState.flow,
                              }),
                              ...(queryParametersState.ioSignature && {
                                io_signature: queryParametersState.ioSignature,
                              }),
                              ...(queryParametersState.ioTimestamp && {
                                io_timestamp: queryParametersState.ioTimestamp,
                              }),
                              ...(queryParametersState.preverifiedPhoneNumberId && {
                                preverified_phone_number_id:
                                  queryParametersState.preverifiedPhoneNumberId,
                              }),
                            }}
                          />
                          {!partnerId && (
                            <p className="absolute bottom-2 mt-1 text-xs text-red-600">
                              Please add a Partner ID to enable button
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:grow pt-6">
                  <div className="flex flex-row items-baseline justify-between w-full pb-2">
                    <p className="text-md font-bold text-gray-700 flex-none">
                      Signup Link
                    </p>
                  </div>
                  <div className="relative bg-gray-50 rounded-md lg:grow min-h-36 text text-gray-900 text-sm pt-8">
                    {mounted && (
                      <SyntaxHighlighter
                        language="jsx"
                        style={prism}
                        customStyle={{ background: "transparent" }}
                        wrapLines
                        lineProps={{
                          style: {
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                          },
                        }}
                        className="w-full h-full p-6 max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-full m-0"
                      >
                        {generateSignupLink()}
                      </SyntaxHighlighter>
                    )}
                    <div className="absolute top-3 right-3">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(generateSignupLink());
                          setUrlCopied(true);
                        }}
                        outlined
                      >
                        {urlCopied ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                              />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                              />
                            </svg>
                            Copy URL
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:grow pt-6">
                  <div className="flex flex-row items-baseline justify-between w-full pb-2">
                    <p className="text-md font-bold text-gray-700 flex-none">
                      Connect Button Code
                    </p>
                    <a
                      className="text-sm text-blue-600 px-3 py-1 outline-none hover:text-blue-800 flex flex-row items-center gap-2"
                      href="https://www.npmjs.com/package/360dialog-connect-button"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NPM Package Docs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="relative bg-gray-50 rounded-md lg:grow min-h-36 text text-gray-900 text-sm">
                    {mounted && (
                      <SyntaxHighlighter
                        language="jsx"
                        style={prism}
                        customStyle={{ background: "transparent" }}
                        className="w-full h-full p-6 max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-full m-0"
                      >
                        {generateCodeSnippet()}
                      </SyntaxHighlighter>
                    )}
                    <div className="absolute top-3 right-3">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(generateCodeSnippet());
                          setCopied(true);
                        }}
                        outlined
                      >
                        {copied ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                              />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                              />
                            </svg>
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:grow pt-6">
                  <div className="flex flex-row items-baseline justify-between w-full pb-2">
                    <p className="text-md font-bold text-gray-700 flex-none">
                      Vanilla JS / HTML Usage
                    </p>
                    <a
                      className="text-sm text-blue-600 px-3 py-1 outline-none hover:text-blue-800 flex flex-row items-center gap-2"
                      href="https://www.npmjs.com/package/360dialog-connect-button"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Vanilla Usage Docs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="relative bg-gray-50 rounded-md lg:grow min-h-36 text text-gray-900 text-sm">
                    {mounted && (
                      <SyntaxHighlighter
                        language="html"
                        style={prism}
                        customStyle={{ background: "transparent" }}
                        className="w-full h-full p-6 max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-full m-0"
                      >
                        {generateVanillaSnippet()}
                      </SyntaxHighlighter>
                    )}
                    <div className="absolute top-3 right-3">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            generateVanillaSnippet(),
                          );
                          setVanillaCopied(true);
                        }}
                        outlined
                      >
                        {vanillaCopied ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                              />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                              />
                            </svg>
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full lg:w-1/4 lg:max-w-xl">
                <p className="text-md font-bold text-gray-700 flex-none">
                  Console
                </p>
                <div className="mt-2 p-6 bg-gray-800 rounded-md lg:grow min-h-28 text text-white font-mono text-sm">
                  {callbackObject ? (
                    <div className="pb-8">
                      <p>Client ID: {callbackObject.client}</p>
                      <p>Channel IDs: {callbackObject.channels.join(", ")}</p>
                      {callbackObject.revokedChannels && (
                        <p>
                          Revoked Channel IDs: {callbackObject.revokedChannels}
                        </p>
                      )}
                    </div>
                  ) : (
                    `>_`
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
