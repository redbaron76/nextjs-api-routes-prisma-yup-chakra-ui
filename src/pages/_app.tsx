import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";

import AuthLayout from "src/components/layouts/AuthLayout";

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <AuthLayout>
      <Component {...pageProps} />
    </AuthLayout>
  );
};

export default App;
