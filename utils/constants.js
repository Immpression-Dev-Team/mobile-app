import { lazy } from 'react'
const HomeScreen = lazy(() => import('../screens/Home'))
const StatisticsScreen = lazy(() => import ('../screens/Statistics'))
const ProfileScreen = lazy(() => import ('../screens/Profile'))
const SettingsScreen = lazy(() => import ('../screens/Settings'))
const SignUp = lazy(() => import ('../screens/SignUp'))
const ImageScreen = lazy(() => import ('../components/ImageScreen'))
const PasswordReset = lazy(() => import ('../screens/PasswordReset'))
const ArtistScreen = lazy(() => import ('../components/ArtistScreens'))
const Upload = lazy(() => import ('../screens/Upload'))
const Login = lazy(() => import ('../screens/Login'))

export const UserNavigation = [{
    name: 'Home',
    component: HomeScreen
},
{
    name: 'Statisctics',
    component: StatisticsScreen
},
{
    name: 'Profile',
    component: ProfileScreen
},
{
    name: 'Settings',
    component: SettingsScreen
},
{
    name: 'SignUp',
    component: SignUp
},
{
    name: 'ImageScreen',
    component: ImageScreen
},
{
    name:'PasswordReset',
    component: PasswordReset
},
{
    name:'ArtistScreens',
    component: ArtistScreen
},
{
    name: 'Upload',
    component: Upload
}]

export const GuestNavigation = [
    {
        name:'Login',
        component: Login
    },
    {
        name:'SignUp',
        component: SignUp
    },
    {
        name: 'PasswordReset',
        component: PasswordReset
    }
]