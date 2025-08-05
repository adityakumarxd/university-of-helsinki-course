import StatisticLine from "./StatisticLine"

export default function Statistics({ good, neutral, bad, all, average, positive }) {

    return (
        <>
            <table>
                <tbody>
                    <StatisticLine name="good" stat={good}></StatisticLine>
                    <StatisticLine name="neutral" stat={neutral}></StatisticLine>
                    <StatisticLine name="bad" stat={bad}></StatisticLine>
                    <StatisticLine name="all" stat={all}></StatisticLine>
                    <StatisticLine name="average" stat={average}></StatisticLine>
                    <StatisticLine name="positive" stat={positive}></StatisticLine>
                </tbody>
            </table>
        </>
    )

}