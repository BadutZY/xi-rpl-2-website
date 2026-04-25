import { useEffect, useRef } from "react";

/**
 * Mengunci scroll halaman ketika `isLocked` bernilai true.
 * Ketika di-unlock, posisi scroll dikembalikan ke posisi semula.
 * Aman untuk banyak modal sekaligus karena pakai ref counter.
 */
export function useScrollLock(isLocked: boolean) {
  const scrollYRef = useRef<number>(0);

  useEffect(() => {
    if (isLocked) {
      // Simpan posisi scroll saat ini
      scrollYRef.current = window.scrollY;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // cegah layout shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      const targetScrollY = scrollYRef.current;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";

      // Kembalikan posisi scroll
      window.scrollTo({ top: targetScrollY, behavior: "instant" as ScrollBehavior });
    }

    // Cleanup: pastikan body di-reset jika komponen unmount saat modal masih terbuka
    return () => {
      if (isLocked) {
        const targetScrollY = scrollYRef.current;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        document.body.style.paddingRight = "";
        window.scrollTo({ top: targetScrollY, behavior: "instant" as ScrollBehavior });
      }
    };
  }, [isLocked]);
}