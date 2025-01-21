import SectionTemplate from "../SectionTemplate/Section";
import CategoryNavBar from "./CategoryNavBar";

export default function CategoryNavSection(){
    return(
        <SectionTemplate
            renderSection={<CategoryNavBar/>}
            height={8}
            marginHeight={1}
        />
    )
}