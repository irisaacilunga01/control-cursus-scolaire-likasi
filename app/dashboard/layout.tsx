import { createClient } from "@/lib/supabase/server";
import LinkUrl from "./linkUrl";
import LinkUrlMobile from "./linkUrlMobile";
import { redirect } from "next/navigation";
export default async function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  let userRole = "";
  if (data?.user) {
    userRole = data?.user.user_metadata.role;
  } else {
    return redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <LinkUrl email={data?.user?.email} role={userRole} />
      </aside>
      <div className="flex flex-col sm:gap-4 sm:pl-14 ">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <LinkUrlMobile role={userRole} />
        </header>
        <main className="p-2">{children}</main>
      </div>
    </div>
  );
}
