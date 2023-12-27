import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const RedirectHandler = ({
  children,
  bookid,
  volumenum,
}: {
  children: ReactNode;
  bookid: string;
  volumenum: string;
}) => {
  const router = useRouter();
  useEffect(() => {
    const bookId = decodeURIComponent(bookid);
    const volumeNum = decodeURIComponent(volumenum);
    const shouldRedirect = async () => {
      let redirect: string | null = null;
      let bookSegment = bookId;
      if (!/^\d+$/.test(bookId)) {
        const res = await fetch(`/api/book?name=${bookId}`);
        const data = await res.json();
        redirect = `/mokuro/${data.id}/${volumeNum}`;
        bookSegment = data.id;
      }
      if (!/^\d+$/.test(volumeNum)) {
        const volumeSegment = volumeNum.match(/^Volume (\d+).html$/);
        if (!volumeSegment) {
          return;
        }
        redirect = `/mokuro/${bookSegment}/${volumeSegment[1]}`;
      }
      if (redirect) {
        return router.replace(redirect);
      }
    };
    shouldRedirect();
  }, [bookid, volumenum, router]);
  return <div>{children}</div>;
};

export default RedirectHandler;
