import { Link } from 'react-router-dom'
import { IconButton, Tooltip } from '@mui/material'
import { FiExternalLink } from 'react-icons/fi'
import { nameSplit } from '../utils/Utils'
import AvatarComponent from './AvatarComponent'
import '../assets/styles/components/CardAppointment.scss'

interface props {
	format_appointment_date: string
	patient_name: string
	appointment_date: string
	appointment_state: string
	_id: string
}

const CardAppointment = ({
	format_appointment_date,
	patient_name,
	appointment_date,
	appointment_state,
	_id,
}: props) => {
	const validationDate =
		appointment_state === 'Activa' &&
		new Date().getTime() >= new Date(appointment_date).getTime()
	return (
		<div className="dashboard__appointments__schedule__appointment" key={_id}>
			{validationDate ? (
				<Tooltip title="Cita atrasada">
					<time
						className={`dashboard__appointments__schedule__appointment__moment ${validationDate
							? 'late__date'
							: null}`}>
						{format_appointment_date}
					</time>
				</Tooltip>
			) : (
				<time className="dashboard__appointments__schedule__appointment__moment">
					{format_appointment_date}
				</time>
			)}
			<article className="dashboard__appointments__schedule__appointment__patient">
				<AvatarComponent
					name={patient_name}
					className="dashboard__appointments__schedule__appointment__patient__avatar"
				/>
				<Tooltip title={patient_name}>
					<h3>{nameSplit(patient_name)}</h3>
				</Tooltip>
			</article>
			<div
				className={`dashboard__appointments__schedule__appointment__state ${appointment_state}`}>
				{appointment_state}
			</div>
			<Tooltip title="Ver cita">
				<Link
					to={`/private/appointments/${_id}`}
					className="dashboard__appointments__schedule__appointment__link">
					<IconButton className="btn__icon">
						<FiExternalLink size={18} />
					</IconButton>
				</Link>
			</Tooltip>
		</div>
	)
}

export default CardAppointment