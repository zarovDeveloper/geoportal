import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import Map from '@/components/map/Map'
import { useAuthStore } from './store/auth'
import { LogOut } from 'lucide-react'

function App() {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const logout = useAuthStore((state) => state.logout)

    return (
        <div className="grid h-screen w-full grid-rows-[auto_1fr]">
            <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
                <h1 className="text-lg font-semibold">Geoportal</h1>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => logout()}>
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Logout</span>
                    </Button>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-4 w-4" />
                                <span className="sr-only">Toggle Layers</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Layers</SheetTitle>
                                <SheetDescription>
                                    Manage and view different map layers.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-4">
                                <p>Layer controls will go here.</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
            <main>
                <Map />
            </main>
        </div>
    )
}

export default App
