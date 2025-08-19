import logoImage from '@images/lirt.png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={logoImage} alt="Logo" className="size-full object-cover object-center rounded-md" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Ibrahim Alshekh</span>
            </div>
        </>
    );
}
