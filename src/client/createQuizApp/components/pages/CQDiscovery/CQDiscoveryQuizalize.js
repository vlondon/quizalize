import React from 'react'

class CQDiscoveryQuizalize extends React.Component {
    render () {
        return (
            <div className="cq-discovery__quizalize">
                <h1>Discover Quizalize</h1>
                <h3>
                    If you haven’t discovered Quizalize yet,
                    the benefits of Quizalize Unlimited come on top of all the
                    great features of Quizalize Standard, such as:
                </h3>
                <h3 className="cq-discovery__quizalize__video">
                    <a href="https://www.youtube.com/watch?v=jmgMbEzkRUA" target="_blank">
                        Watch a video <img src={require('./../../../../assets/cq-discovery__play.svg')} alt=""/>
                    </a>
                </h3>
                <ul className="cq-discovery__quizalize__list__1">
                    <li>
                        Create unique quizzes tailored exactly to the needs of your class
                    </li>
                    <li>
                        Use one of hundreds of curriculum-linked quizzes created by other teachers
                    </li>
                    <li>
                        Set quizzes for homework and spot any individual learning gaps instantly
                    </li>
                    <li>
                        Play in class and use our Team Game view, so teams of students can compete against each other
                    </li>
                </ul>
                <ul className="cq-discovery__quizalize__list__2">
                    <li>
                        Export reports of students’ performance and overall class achievement
                    </li>
                    <li>
                        Publish unlimited quizzes to our Marketplace and earn income when other teachers buy them
                    </li>
                    <li>
                        Uses quizzes based on content from leading educational publishers
                    </li>
                    <li>
                        Create a unique profile page, so other teachers can discover your content
                    </li>
                </ul>

                <h4 className="cq-discovery__quizalize__more">
                    <a href="/">Find out more…</a>
                </h4>

            </div>
        );
    }
}

export default CQDiscoveryQuizalize;
