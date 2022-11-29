import Head from "next/head";
import React from "react";
import "../assets/css/style.scss";
import "rsuite/dist/rsuite.min.css";
import CommonLayout from "../component/UI/Layout";
import { useMessageStore } from "src/store/messageStore";
import { useEffect } from "react";
import TOAST_STATUS from "../constant/message.constant";
import { CustomProvider, Message, useToaster } from "rsuite";
import Script from "next/script";


export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || CommonLayout;

  const messageStore = useMessageStore((state) => state);

  const toaster = useToaster();

  const message = (
    <Message showIcon type={messageStore?.type || "success"}>
      {messageStore?.message}
    </Message>
  );

  useEffect(() => {
    if (messageStore.status === TOAST_STATUS.PUSHED && messageStore.message) {
      const key = toaster.push(message, { placement: "topCenter" });
      setTimeout(() => {
        messageStore.clearState();
      }, 0);
    }
  }, [messageStore]);

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" />
        <script src="https://pc.baokim.vn/js/bk_plus_v2.popup.js" />
        {/* <Script src="https://pc.baokim.vn/js/bk_plus_v2.popup.js" /> */}
      </Head>
      <CustomProvider>
        {Component.Admin ? (
          <Component.Admin>
            <Component {...pageProps} />
          </Component.Admin>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </CustomProvider>
    </>
  );
}
