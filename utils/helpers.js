import { Suspense } from "react";
import { GuestNavigation, UserNavigation } from "./constants"
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicatorComponent } from "react-native";

const Stack = createStackNavigator();

export const pageSuspense = (component) => {
    return <Suspense fallback = {<ActivityIndicatorComponent/>}>{component}</Suspense>
}

export const userStackScreen = () => {
    return (
        UserNavigation.map((navigation) => <Stack.Screen key = {navigation.name} name = {navigation.name} component = {navigation.component}/>)
    )
}

export const guestStackScreen = () => {
    return (
        GuestNavigation.map((navigation) => <Stack.Screen key = {navigation.name} name = {navigation.name} component = {navigation.component}/>)
    )
}
