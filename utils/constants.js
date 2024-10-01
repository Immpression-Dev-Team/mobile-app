import { lazy } from 'react'
import SettingsScreen from '../screens/Settings'
import HomeScreen from '../screens/Home'
import StatisticsScreen from '../screens/Statistics'
import Profile from '../screens/Profile'
// const HomeScreen = lazy(() => import('../screens/Home'))
// const StatisticsScreen = lazy(() => import ('../screens/Statistics'))
// const ProfileScreen = lazy(() => import ('../screens/Profile'))
// const SettingsScreen = lazy(() => import ('../screens/Settings'))
import SignUp from '../screens/SignUp'
import ImageScreen from '../components/ImageScreen'
import PasswordReset from '../screens/PasswordReset'
import ArtistScreen from '../components/ArtistScreens'
import Upload from '../screens/Upload'
import Login from '../screens/Login'
// const SignUp = lazy(() => import ('../screens/SignUp'))
// const ImageScreen = lazy(() => import ('../components/ImageScreen'))
// const PasswordReset = lazy(() => import ('../screens/PasswordReset'))
// const ArtistScreen = lazy(() => import ('../components/ArtistScreens'))
// const Upload = lazy(() => import ('../screens/Upload'))
// const Login = lazy(() => import ('../screens/Login'))

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
    component: Profile
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