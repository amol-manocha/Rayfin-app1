//-----------------------------------------------------------------------
// Claims Insight — root application. Wires the in-app router to the shell
// and switches between the Book Overview and the 360 investigation pages.
//-----------------------------------------------------------------------

import { RouterProvider, useRouter } from "@/lib/router";
import { AppShell } from "@/components/app-shell";
import { BookOverviewPage } from "@/pages/book-overview";
import { Claim360Page } from "@/pages/claim-360";
import { Customer360Page } from "@/pages/customer-360";
import { Adjuster360Page } from "@/pages/adjuster-360";

function CurrentPage() {
    const { route } = useRouter();
    switch (route.name) {
        case "overview":
            return <BookOverviewPage />;
        case "claim":
            return <Claim360Page claimId={route.id} />;
        case "customer":
            return <Customer360Page customerId={route.id} />;
        case "adjuster":
            return <Adjuster360Page adjusterId={route.id} />;
    }
}

function App() {
    return (
        <RouterProvider>
            <AppShell>
                <CurrentPage />
            </AppShell>
        </RouterProvider>
    );
}

export default App;
