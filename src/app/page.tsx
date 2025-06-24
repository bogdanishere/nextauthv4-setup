import { auth } from "./api/auth/[...nextauth]/auth";

export default async function Home() {
  const session = await auth();
  console.log("Session:", session);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      test
    </div>
  );
}
