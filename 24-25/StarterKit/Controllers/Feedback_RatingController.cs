using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Feedback_RatingController : ControllerBase
    {
        private readonly IFeedback_RatingService _feedbackRatingService;

        public Feedback_RatingController(IFeedback_RatingService feedbackRatingService)
        {
            _feedbackRatingService = feedbackRatingService;
        }

    //Add feedback
        [HttpPost("feedback")]
        public async Task<IActionResult> AddFeedback([FromBody] Event_Attendance eventAttendance)
        {
            await _feedbackRatingService.AddFeedbackAsync(eventAttendance);
            return Ok();
        }

    //Add rating
        [HttpPost("rating")]
        public async Task<IActionResult> AddRating([FromBody] Event_Attendance eventAttendance)
        {
            await _feedbackRatingService.AddRatingbackAsync(eventAttendance);
            return Ok();
        }

    //Delete feedback
        [HttpDelete("feedback/{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            await _feedbackRatingService.DeleteFeedbackAsync(id);
            return Ok();
        }

    //Delete rating
        [HttpDelete("rating/{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            await _feedbackRatingService.DeleteRatingbackAsync(id);
            return Ok();
        }

    //Get feedback
        [HttpGet("feedback/{id}")]
        public async Task<IActionResult> GetFeedback(int id)
        {
            var feedback = await _feedbackRatingService.GetFeedbackAsync(id);
            if (feedback == null)
            {
                return NotFound();
            }
            return Ok(feedback);
        }

    //Get rating
        [HttpGet("rating/{id}")]
        public async Task<IActionResult> GetRating(int id)
        {
            var rating = await _feedbackRatingService.GetRatingbackAsync(id);
            if (rating == null)
            {
                return NotFound();
            }
            return Ok(rating);
        }

    //Update feedback
        [HttpPut("feedback")]
        public async Task<IActionResult> UpdateFeedback([FromBody] Event_Attendance eventAttendance)
        {
            await _feedbackRatingService.UpdateFeedbackAsync(eventAttendance);
            return Ok();
        }

    //Update rating
        [HttpPut("rating")]
        public async Task<IActionResult> UpdateRating([FromBody] Event_Attendance eventAttendance)
        {
            await _feedbackRatingService.UpdateRatingbackAsync(eventAttendance);
            return Ok();
        }

        //Get all feedback and ratings (Only for admin)
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllFeedbackAndRatings()
        {
            var allFeedbackAndRatings = await _feedbackRatingService.GetAllFeedbackAndRatingsAsync();
            return Ok(allFeedbackAndRatings);
        }
    }
}