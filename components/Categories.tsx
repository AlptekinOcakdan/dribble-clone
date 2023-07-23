"use client"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { categoryFilters } from "@/constants";

type Props = {
    filter?: string;
};

const Categories = ({ filter }: Props) => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const category = searchParams.get("category");

    const handleTags = (item: string) => {
        router.push(`${pathName}?category=${item}`);
    };

    return (
        <div className="flexBetween w-full gap-5 flex-wrap">
            <ul className="flex gap-2 overflow-auto">
                {categoryFilters.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => handleTags(item)}
                        className={`${
                            (filter && filter === item) || (category && category === item)
                                ? "bg-light-white-300 font-medium"
                                : "font-normal"
                        } px-4 py-3 rounded-lg capitalize whitespace-nowrap`}
                    >
                        {item}
                    </button>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
