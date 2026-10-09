import { profile } from '../data/portfolio'

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-block uppercase leading-none tracking-[-0.02em] font-normal select-none ${className}`}>
      {profile.firstName}
      <span className="text-white/45">{profile.lastName}</span>
    </span>
  )
}
