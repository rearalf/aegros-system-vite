import React from 'react'
import { CardAppointment, EmptyData } from '@components'

const AppointmentsWeek = ({ appointments = [], daysAppointments = [] }) => {
	return appointments.length ? (
		<div className="dashboard__appointments__schedule">
			{daysAppointments.map(day => {
				const today = new Date()
				const todaySelect = new Date(
					today.getFullYear(),
					today.getMonth(),
					day.split(' ')[1],
				).getDate()
				const validationToday = today.getDate() === todaySelect
				return (
					<div className="dashboard__appointments__schedule__week" key={day}>
						<article className="dashboard__appointments__schedule__week__header">
							<h3
								className={`dashboard__appointments__schedule__week__header__title ${validationToday
									? 'today'
									: ''}`}>
								{validationToday ? <FiArrowRight /> : null}
								{day}
							</h3>
							<hr className="dashboard__appointments__schedule__week__header__hr" />
						</article>
						<div className="dashboard__appointments__schedule__week__appointment">
							{appointments.map(data => {
								const { format_day_appointment_date, _id } = data
								if (day === format_day_appointment_date)
									return <CardAppointment {...data} key={_id} />
								return null
							})}
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<EmptyData title="No hay citas para está semana." />
	)
}

export default AppointmentsWeek
