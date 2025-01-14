export default function AdminSideBar() {
    return (
        <div className="min-h-screen w-64 bg-grey dark:bg-gray-800 shadow-md">
            <nav className="sticky top-0 pt-8">
                <div className="px-4">
                    <div className="space-y-4">
                        <a 
                            href="/admin/events"
                            className="flex items-center px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <span className="ml-2">Events</span>
                        </a>
                        <a 
                            href="/admin/users"
                            className="flex items-center px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <span className="ml-2">Users</span>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
}