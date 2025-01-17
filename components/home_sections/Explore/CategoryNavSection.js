import SectionTemplate from "../SectionTemplate/Section";
import CategoryNavBar from "./CategoryNavBar";

export default function CategoryNavSection(){
    return(
        <SectionTemplate
            sectionName='CategoryNavBar'
            renderSection={<CategoryNavBar/>}
            headerHeight={12.5}
            footerHeight={20}
        />
    )
}